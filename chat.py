import flask
from flask import request
import redis
import time
import json


red = redis.Redis(host='localhost', port=6379, db=0)
print('redis', red)

app = flask.Flask(__name__)
app.secret_key = 'key'


chat_channel = 'chat'


def stream():
    """
    监听 redis 广播并 sse 到客户端
    """
    pubsub = red.pubsub()
    pubsub.subscribe(chat_channel)
    for message in pubsub.listen():
        print(message)
        if message['type'] == 'message':
            data = message['data'].decode('utf-8')
            yield 'data: {}\n\n'.format(data)


@app.route('/subscribe')
def subscribe():
    return flask.Response(stream(), 
        mimetype="text/event-stream")


@app.route('/')
def index_view():
    return flask.render_template('index.html')


def current_time():
    return int(time.time())


@app.route('/chat/add', methods=['POST'])
def chat_add():
    msg = request.get_json()
    name = msg.get('name', '')
    if name == '':
        name = '<匿名>'
    content = msg.get('content', '')
    channel = msg.get('channel', '')
    r = {
        'name': name,
        'content': content,
        'channel': channel,
        'created_time': current_time(),
    }
    message = json.dumps(r, ensure_ascii=False)
    print('debug', message)
    red.publish(chat_channel, message)
    return 'OK'


if __name__ == '__main__':
    config = dict(
        host='0.0.0.0',
        debug=True,
    )
    app.run(**config)
