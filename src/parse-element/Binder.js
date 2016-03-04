/*
 *  Elements Parsing module By LancerComet at 18:52, 2016.02.29.
 *  # Carry Your World #
 *  ---
 *  Binder.
 *  
 *  Inspired By http://www.ituring.com.cn/article/48463.
 */

var Binder = {
    $watch: function (key, watcher) {
        
        if (!this.$watchers[key]) {
            this.$watchers[key] = {
                value: this[key],
                list: []
            }
        }
        
        Object.defineProperty(this, key, {
            set: function (value) {
                var oldValue = this.$watchers[key].value;
                this.$watchers[key].value = value;
                
                for (var i = 0, length = this.$watchers[key].list.length; i < length; i++) {
                    this.$watchers[key].list[i](value, oldValue);
                }
                
            },
            get: function () {
                return this.$watchers[key].value;
            }
        });
        
        this.$watchers[key].list.push(watcher);
    }
};

module.exports = Binder;