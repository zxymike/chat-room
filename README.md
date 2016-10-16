# chat-room

####安装依赖
- apt-get install redis-server 
- pip3 install python-redis gunicorn

####使用说明
- 使用 gunicorn 启动
      gunicorn --worker-class=gevent -t 9999 redischat:app
- 开启 debug 输出
      gunicorn --log-level debug --worker-class=gevent -t 999 redis_chat81:app
- 把 gunicorn 输出写入到 gunicorn.log 文件中
      gunicorn --log-level debug --access-logfile gunicorn.log --worker-class=gevent -t 999 redis_chat81:app
