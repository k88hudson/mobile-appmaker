module.exports = {
    template: require('./index.html'),
    ready: function () {
        this.$el.id = 'loadingIndicator';
    }
};
