export const fetchData = async (api, setter, callback) => {
    try {
        const data = await api();
        setter(data); 
        if (callback) {
            callback(data); 
        }
    } catch (error) {
        console.log(`Error`, error);
    } finally {
        setLoading(false); 
    }
};