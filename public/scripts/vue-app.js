var socket = io();

app = new Vue({
    el: '#vue-app',
    data: {
        title: 'Instant messenger',
        msgs: [],
        msgObj: {
            sender: "",
            text: "",
            time: "",
            href: "",
            color: ""
        },
        message: ""
    },
    methods: {
        sendMessage: function () {
            if (this.message == "") return;
            socket.emit('chat message', this.message);
            this.resetMessage();
            this.focusInput();
            this.scrollToBottom();
        },
        addMessage: function (msg) {
            this.msgs.push(msg);

        },
        resetMessage: function () {
            this.message = "";
        },
        focusInput: function () {
            this.$refs.msgInput.focus();
        },
        scrollToBottom: function () {
            let messages = document.getElementById("messages");
            messages.scrollTo(0, messages.scrollHeight);
        },
        requestUsername: function () {
            var person = prompt("Please enter your name", "");

            if (person == null || person == "") {
                this.requestUsername();
            } else {
                socket.emit('login name', person);
            }
        }
    },
    mounted: function () {
        this.requestUsername();

        this.focusInput();

        socket.on('chat message', function (msg) {
            app.addMessage(msg);
            if (!document.hasFocus()) beep();
        });
    },
    updated: function () {
        app.scrollToBottom();
    }
});