export default {
    'secret': 'tungtung-gift/gift',
    'database': 'mongodb://127.0.0.1:27017/gift',
    'dbOptions': {
        'db': {'native_parser': true},
        'server': {'poolSize': 5},
        // 'user': 'admin',
        // 'pass': '123456'
    },
    'port': 4438,
    'domainPublic': 'http://127.0.0.1:4438'
}