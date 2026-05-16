# Menggunakan server web Nginx versi ringan sebagai basis
FROM nginx:alpine

# Menyalin seluruh file web Anda ke folder publik Nginx di server
COPY . /usr/share/nginx/html

# Membuka jalur akses port 80 untuk lalu lintas web
EXPOSE 80
