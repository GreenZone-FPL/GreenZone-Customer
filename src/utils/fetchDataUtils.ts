export const fetchData = async <T>(
  api: () => Promise<T>,
  setter: (data: T) => void,
  setLoading?: (loading: boolean) => void,
): Promise<void> => {
  try {
    if (setLoading) {
      setLoading(true);
    }

    const data = await api();
    setter(data);
  } catch (error) {
    console.log(`Error`, error);
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};
