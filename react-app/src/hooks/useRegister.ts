import { useMutation } from '@tanstack/react-query';
import useStore from "./useStore";

const register = async (name: string) => {
if (!process.env.REACT_APP_SERVER_URL)
    throw new Error("REACT_APP_SERVER_URL not set");

    const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/register`,
        {
          method: "POST",
          body: name
        }
      );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const data = await response.json();
    return data;
};

export const useRegister = () => {
  const setUser = useStore((state) => state.setUser);

  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (name: string) => {
      return register(name);
    },
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      setUser(null);
    }
  });
};
