# Menggunakan Node.js 18 sebagai base image
FROM node:18
# Menentukan direktori kerja di dalam container
WORKDIR /app
# Menyalin package.json dan package-lock.json untuk menginstal dependensi
COPY package*.json ./
# Menginstal dependensi
RUN npm install
# Menyalin seluruh file proyek ke dalam container
COPY . .
# Mengekspos port yang digunakan aplikasi Anda (contoh: 3000)
EXPOSE 3000
# Menjalankan aplikasi
CMD ["npm", "start"]
