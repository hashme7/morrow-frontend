
const extractIdFromToken = () => {
  const token = localStorage.getItem('userId');
  return token;
};

export default extractIdFromToken;
