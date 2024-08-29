FROM node:20.16.0

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json в рабочую директорию
COPY package.json ./
COPY yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем все файлы проекта в контейнер
COPY . .

# Компилируем TypeScript в JavaScript
RUN npm run build

# Указываем порт, который будет использоваться приложением
EXPOSE 3000

# Определяем команду для запуска приложения
CMD ["npm", "run", "start:prod"]
