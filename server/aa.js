const axios = require('axios');
const options = {
    method: 'GET',
    url: 'https://blogsapi.p.rapidapi.com/',
    params: {
        ordering: '-date_published'
    },
    headers: {
        'x-rapidapi-key': 'de7b488e02msh06857b4f8b572c2p13e4e5jsn14f794081da8',
        'x-rapidapi-host': 'blogsapi.p.rapidapi.com'
    }
};
async function ss() {
    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}
ss()