FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    icu-dev \
    oniguruma-dev \
    libzip-dev \
    zip \
    unzip \
    openssl

RUN docker-php-ext-install \
    pdo_mysql \
    intl \
    zip \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction

COPY . .

RUN mkdir -p config/jwt && \
    openssl genrsa -aes256 -passout env:JWT_PASSPHRASE -out config/jwt/private.pem 4096 && \
    openssl rsa -pubout -passin env:JWT_PASSPHRASE -in config/jwt/private.pem -out config/jwt/public.pem

RUN chown -R www-data:www-data var/

CMD ["php-fpm"]
