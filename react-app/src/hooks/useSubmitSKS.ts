import { useMutation } from '@tanstack/react-query';
import useStore from "./useStore";

const submitServerKeyShare = async (args: ISubmitServerKeyShareArgs) => {
if (!process.env.REACT_APP_SERVER_URL)
    throw new Error("REACT_APP_SERVER_URL not set");

    const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/submit_sks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...args })
        }
      );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const data = await response.json();
    return data;
};

export const useSubmitServerKeyShare= () => {
  const setUser = useStore((state) => state.setUser);

  return useMutation({
    mutationKey: ["submitServerKeyShare"],
    mutationFn: async (args: ISubmitServerKeyShareArgs) => {
      return submitServerKeyShare(args);
    },
  });
};

export interface ISubmitServerKeyShareArgs {
    userId: string;
    sks: string;
}
