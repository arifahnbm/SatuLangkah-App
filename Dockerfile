# Menggunakan server web Nginx versi ringan sebagai basis
FROM nginx:alpine

# Mengubah port default Nginx dari 80 ke 8080 agar sesuai dengan Cloud Run
RUN sed -i 's/listen\(.*\)80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Menyalin seluruh file web Anda ke folder publik Nginx di server
COPY . /usr/share/nginx/html

# Membuka jalur akses port 8080 untuk lalu lintas web Cloud Run
EXPOSE 8080
