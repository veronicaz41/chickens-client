import { useQuery } from '@tanstack/react-query';

const getParam = async () => {
if (!process.env.REACT_APP_SERVER_URL)
    throw new Error("REACT_APP_SERVER_URL not set");

    const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/param`,
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const data = await response.json();
    return data;
};

export const useGetParam = () => {
    return useQuery({ queryKey: ['param'], queryFn: getParam });
};
