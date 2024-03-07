const {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  where,
  query,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  orderBy
} = require('firebase/firestore');
const { promisify } = require('util');
const { createReadStream } = require('fs');
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} = require('firebase/storage');

const storage = getStorage();
const storageRef = ref(storage);
const imagesRef = ref(storage, 'images');
const path = require('path');
const Super = require('./super');
const HttpException = require('../helpers/HttpException.helper');
const db = require('../DBConfig');


const chatsRef = collection(db, 'chats');
const usersRef = collection(db, 'users');

class Chat extends Super {
  constructor() {
    super({
      BASE_ENDPOINT: '/chats',
    });
  }
  async getChatData(chatId) {
    try {
      const chatDoc = doc(chatsRef, chatId);
      const chatDocSnap = await getDoc(chatDoc);

      if (chatDocSnap.exists()) {
        const messagesCollection = collection(chatDoc, 'messages')
        const messagesQuery = query(messagesCollection, orderBy('createdAt', 'asc'));
        const messagesSnap = await getDocs(messagesQuery);
        const chatData = {
          chatId: chatDocSnap.id,
          participants: chatDocSnap.data().participants,
          messages: messagesSnap.docs.map(messageDoc => ({
            messageId: messageDoc.id,
            ...messageDoc.data(),
            createdAt: messageDoc.data().createdAt.toDate(),
          })),
        };
        return chatData;
      } else {
        throw HttpException.NOT_FOUND('Chat does not exist.');
      }
    } catch (error) {
      console.error('Error getting chat data:', error);
      throw HttpException.BAD_REQUEST('Error getting chat data');
    }
  }

  async openChat(openChatDTO) {
    const { chatId } = openChatDTO;
    const chatDoc = doc(chatsRef, chatId);
    const chatDocSnap = await getDoc(chatDoc);

    if (chatDocSnap.exists()) {
      const chatData = await this.getChatData(chatId)
      return chatData;
    } else {
      const usersIds = chatId?.split('_');
      const user1Id = usersIds[0];
      const user2Id = usersIds[1];
      const user1Ref = doc(usersRef, user1Id);
      const user1Snap = await getDoc(user1Ref);
      const user1Name = user1Snap.data().name;
      const user2Ref = doc(usersRef, user2Id);
      const user2Snap = await getDoc(user2Ref);
      const user2Name = user2Snap.data().name;
      const participant1 = { user1: user1Name };
      const participant2 = { user2: user2Name };

      const initialChatData = {
        participants: { ...participant1, ...participant2 },
        messages: [],
      };

      await setDoc(doc(chatsRef, chatId), initialChatData);
      return {
        chatId: chatId,
        participants: initialChatData.participants,
        messages: [],
      };
    }
  }
  async addMessage(addMessageDTO) {
    try {
      const { content, sender, imgs, chatId, senderName } = addMessageDTO;
      const chatDoc = doc(chatsRef, chatId);
      const chatDocSnap = await getDoc(chatDoc);

      if (chatDocSnap.exists()) {
        const messagesCollection = collection(chatDoc, 'messages');

        let newMessageData = {
          senderName: senderName,
          content: content,
          sender: sender,
          imgs: [],
          createdAt: serverTimestamp(),
        };
        const newMessageRef = await addDoc(messagesCollection, newMessageData);
        const newMessageDoc = await getDoc(newMessageRef);

        const storage = getStorage();
        if (Array.isArray(imgs)) {
          const uploadTasks = [];

          for (const file of imgs) {
            const readFile = promisify(require('fs').readFile);
            const fileData = await readFile(file.path);
            const uint8Array = new Uint8Array(fileData);

            const fileName = path.basename(file.path);

            const fileRef = ref(
              storage,
              `chat_files/${chatId}/${newMessageRef.id}/${fileName}`
            );

            const uploadTask = uploadBytes(fileRef, uint8Array);
            uploadTasks.push(uploadTask);
          }
          await Promise.all(uploadTasks);
          const downloadURLs = await Promise.all(
            imgs.map(file => {
              const fileName = path.basename(file.path);
              const fileRef = ref(
                storage,
                `chat_files/${chatId}/${newMessageRef.id}/${fileName}`
              );
              return getDownloadURL(fileRef);
            })
          );

          await updateDoc(newMessageRef, {
            imgs: downloadURLs,
          });

          const updatedChatData = await this.getChatData(chatId);

          return updatedChatData;
        } else if (typeof imgs === 'object' && imgs !== null) {
          const file = imgs;
          const readFile = promisify(require('fs').readFile);
          const fileData = await readFile(file.path);
          const uint8Array = new Uint8Array(fileData);

          const fileName = path.basename(file.path);

          const fileRef = ref(
            storage,
            `chat_files/${chatId}/${newMessageRef.id}/${fileName}`
          );

          await uploadBytes(fileRef, uint8Array);

          const downloadURL = await getDownloadURL(fileRef);
          // newMessageData.imgs = [downloadURL];

          await updateDoc(newMessageRef, {
            imgs: [downloadURL],
          });
          const updatedChatData = await this.getChatData(chatId);

          // const messagesCollection = collection(chatDoc, 'messages');
          // const sortedMessagesQuery = query(messagesCollection, orderBy('createdAt', 'desc'));

          // const messagesSnapshot = await getDocs(sortedMessagesQuery);
          // const sortedMessages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          return updatedChatData;
        } else {
          const updatedChatData = await this.getChatData(chatId);

          return updatedChatData;
        }
      } else {
        throw HttpException.NOT_FOUND('Chat does not exist.');
      }
    } catch (error) {
      console.error('Error adding message:', error);
      throw HttpException.INTERNAL_SERVER_ERROR('Error adding message');
    }
  }

  async editMessage(editMessageDTO) {
    try {
      const { messageId, content, userId, chatId } = editMessageDTO;

      const chatDoc = doc(chatsRef, chatId);
      const chatDocSnap = await getDoc(chatDoc);

      if (chatDocSnap.exists()) {
        const messagesCollection = collection(chatDoc, 'messages');
        const messageDocRef = doc(messagesCollection, messageId);
        const messageDocSnap = await getDoc(messageDocRef);

        if (messageDocSnap.exists()) {
          const senderId = messageDocSnap.data().sender;
          if (senderId !== userId) {
            throw HttpException.FORBIDDEN(
              'You are not authorized to edit this message.'
            );
          }
          await updateDoc(messageDocRef, {
            content: content,
          });
          const updatedChatData = await this.getChatData(chatId);

          return updatedChatData;
        } else {
          throw HttpException.NOT_FOUND('Message does not exist.');
        }
      } else {
        throw HttpException.NOT_FOUND('Message does not exist.');
      }
    } catch (error) {
      console.error('Error editing message:', error);
      throw HttpException.INTERNAL_SERVER_ERROR('Error editing message');
    }
  }

  async deleteMessage(deleteMessageDTO) {
    try {
      const { messageId, userId, chatId } = deleteMessageDTO;
      const chatDoc = doc(chatsRef, chatId);
      const chatDocSnap = await getDoc(chatDoc);
      if (chatDocSnap.exists()) {
        const messagesCollection = collection(chatDoc, 'messages');
        const messageDocRef = doc(messagesCollection, messageId);
        const messageDocSnap = await getDoc(messageDocRef);
        if (messageDocSnap.exists()) {
          const senderId = messageDocSnap.data().sender;
          if (senderId !== userId) {
            throw HttpException.FORBIDDEN(
              'You are not author of this message.'
            );
          }
          // Отримайте URL файлу з повідомлення
          const fileUrl = messageDocSnap.data().fileUrl;

          // Видалення файлу з Firebase Storage
          if (fileUrl) {
            const fileRef = storage.refFromURL(fileUrl);
            await fileRef.delete();
          }
          await deleteDoc(messageDocRef);
          const updatedChatData = await this.getChatData(chatId);

          return { message: 'DELETED', updatedChatData };
        } else {
          throw HttpException.NOT_FOUND('Message does not exist.');
        }
      } else {
        throw HttpException.NOT_FOUND('Chat does not exist.');
      }
    } catch (error) {
      console.error('Error delete message:', error);
      throw HttpException.INTERNAL_SERVER_ERROR('Error delete message');
    }
  }
}
module.exports = new Chat();
