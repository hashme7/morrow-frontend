import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const extractIdFromToken = () => {
  const token = Cookies.get("accessToken");
  console.log(`
        extractIdFromToken :- ${Cookies.get('accessToken')}
    `)
  if (!token) {
    return null
  }
  const decoded = jwtDecode<{ role: string; id: string }>(token);
  return decoded.id;
};

export default extractIdFromToken;
