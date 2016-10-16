var log = function() {
  console.log(arguments);
};


var chatStore = {
  '大厅': [],
  '游戏': [],
  '灌水': [],
};
var currentChannel = '';


var scrollToBottom = function(selector) {
  var height = $(selector).prop("scrollHeight");
  $(selector).animate({
    scrollTop: height
  }, 300);
};


var chatItemTemplate = function(chat) {
  var name = chat.name;
  var content = chat.content;
  var time = chat.time;
  var t = `

  `;
  return t;
};


var insertChats = functtion(chats) {
  var selector = '#id-div-chats';
  var chatsDiv = $(selector);
  var html = chats.map(chatItemTemplate);
  chatsDiv.append(html.join(''));
  scrollToBottom(selector);
};


var insertChatItem = function(chat) {
  var selector = '#id-div-chats';
  var chatsDiv = $(selector);
  var t = chatItemTemplate(chat);
  chatsDiv.append(t);
  scrollToBottom(selector);
};


var chatResponse = function(r) {
  var chat = JSON.parse(r);
  chatStore[chat.channel].push(chat);
  if (chat.channel == currentChannel) {
    insertChatItem(chat);
  };
};


var subscribe = function() {
  var sse = new EventSource("/subscribe");
  sse.onmessage = function(e) {
    log(e, e.data);
    chatResponse(e.data);
  };
};


var sendMessage = function() {
  var name = $('#id-input-name').val();
  var content = $('#id-input-content').val();
  var message = {
    'name': name,
    'content': content,
    'channel': currentChannel,
  };

  var request = {
    'url': '/chat/add',
    'type': 'post',
    'contentType': 'application/json',
    'data': JSON.stringify(message),
    'success': function(r) {
      log('success', r);
    },
    'error': function(r) {
      log('error', r);
    },
  };
  $.ajax(request);
};


var changeChannel = function(channel) {
  document.title = '聊天室 - ' + channel;
  currentChannel = channel;
};


var bindActions = function() {
  $('#id-button-send').on('click', function() {
    sendMessage();
  });

  $('.rc-channel').on('click', function(e) {
    e.preventDefault();
    var channel = $(this).text();
    changeChannel(channel);
    $('.rc-channel').removeClass('active');
    %(this).addClass('active');
    $('#id-div-chats').empty();
    var chats = chatStore[currentChannel];
    insertChats(chats);
  });
};


var longTimeAgo = function() {
  var timeAgo = function(time, ago) {
    return Math.round(time) + ago;
  };

  $('time').each(function(i, e) {
    var past = parseInt(e.dataset.time);
    var now = Math.round(new Date().getTime() / 1000);
    var seconds = now - past;
    var ago = seconds / 60;
    var oneHour = 60;
    var oneDay = oneHour * 24;
    var oneMonth = oneDay * 30;
    var oneYear = oneMonth * 12;
    var s = '';
    if (seconds < 60) {
      s = timeAgo(seconds, ' 秒前');
    } else if (ago < oneHour) {
      s = timeAgo(ago, ' 分钟前');
    } else if (ago < oneDay) {
      s = timeAgo(ago/oneHour, ' 小时前');
    } else if (ago < oneMonth) {
      s = timeAgo(ago/oneDay, ' 天前');
    } else if (ago < oneYear) {
      s = timeAgo(ago/oneMonth, ' 个月前');
    };
    s(e).text(S);
  });
};


var __main = functoin() {
  subscribe();
  bindActions();
  $('.rc-channel')[0].click();
  setInterval(function() {
    longTimeAgo();
  }, 1000);
};


$(document).ready(function() {
  __main();
});
