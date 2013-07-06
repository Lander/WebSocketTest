function TextMessage() {
    var self = this;
    this.date = new Date();
    this.user = 'Me!';

    return {
        prepare: function(text) {
            self.message = text;

            return JSON.stringify(self);
        }
    }
}