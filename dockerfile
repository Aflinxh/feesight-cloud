# Menggunakan image node.js yang resmi sebagai base image
FROM node:20

# Menetapkan direktori kerja dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Menginstall dependencies
RUN npm install

# Menyalin seluruh source code aplikasi ke direktori kerja dalam container
COPY . .

# Mengekspos port aplikasi
EXPOSE 3000

# Menjalankan aplikasi
CMD ["node", "server.js"]
