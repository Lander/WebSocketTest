function TextMessage() {
    var self = this;

    return {
        prepare: function(text) {
            self.message = text;

            return JSON.stringify(self);
        }
    }
}