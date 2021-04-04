import axiosConfig from './axiosConfig';

/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 */
const fetchJSON = (url, options = {}) => {

    return axiosConfig.get(url, options)
        .then(response => response.data)
        .then(data => {
            return data;
        })
        .catch(error => {
            throw error;
        });
        
};

export { fetchJSON };