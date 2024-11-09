// backend/index.js
// const express = require('express');
 
// const PORT = process.env.PORT || 3010;
// const app = express();
 
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// });

// const todoItems = require('./todo-items.json');
// app.get('/api/todo-items', (req, res) => {
//   res.json({ data: todoItems });
// });

// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });









const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3010;
const app = express();

// Мидлвар для парсинга JSON тела запросов
app.use(express.json());

// Разрешаем CORS для всех источников
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Путь к файлу с задачами
const todoItemsPath = path.join(__dirname, 'todo-items.json');

// Чтение задач из файла
const readTodoItems = () => {
  return JSON.parse(fs.readFileSync(todoItemsPath, 'utf8'));
};

// Запись обновленных задач в файл
const writeTodoItems = (items) => {
  fs.writeFileSync(todoItemsPath, JSON.stringify(items, null, 2), 'utf8');
};

// Получаем все задачи
app.get('/api/todo-items', (req, res) => {
  const todoItems = readTodoItems();
  res.json({ data: todoItems });
});

// Обновляем задачу по id
app.put('/api/todo-items/:id', (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;

  // Получаем текущий список задач
  let todoItems = readTodoItems();

  // Ищем задачу по id
  const index = todoItems.findIndex((item) => item.id === parseInt(id, 10));
  if (index === -1) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  // Обновляем задачу
  todoItems[index] = { ...todoItems[index], text, done };

  // Сохраняем обновленный список в файл
  writeTodoItems(todoItems);

  // Отправляем обновленную задачу в ответ
  res.json(todoItems[index]);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
