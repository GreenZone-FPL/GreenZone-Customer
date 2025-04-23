export const fetchData = async (api, setter, setLoading) => {
    try {
        setLoading(true)
        const data = await api();
        setter(data); 
      
    } catch (error) {
        console.log(`Error`, error);
    } finally {
        setLoading(false); 
    }
};