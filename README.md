[![Maintainability](https://api.codeclimate.com/v1/badges/26814874f348c5bba581/maintainability)](https://codeclimate.com/github/mixassio/project-lvl3-s310/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/26814874f348c5bba581/test_coverage)](https://codeclimate.com/github/mixassio/project-lvl3-s310/test_coverage)
[![Build Status](https://travis-ci.org/mixassio/project-lvl3-s310.svg?branch=master)](https://travis-ci.org/mixassio/project-lvl3-s310)

# Загрузчик страниц
Утилита скачивает страницу из сети и кладет в указанную папку (по умолчанию в директорию запуска программы).
Также произойдет скачивание всех локальных ресурсов (ссылки без указания домена) находящихся на странице.
В итоге получается страница для чтения оф-лайн.


## Install
```
npm install -g page-loader-mixassio
```
## Use

```
$ page-loader --output /var/tmp https://hexlet.io/courses
$ open /var/tmp/hexlet-io-courses.html
```
## How does it work
The utility downloads the page from the network and puts it in the specified folder (by default to the program's start directory).
