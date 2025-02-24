import React, { createContext, useState, useMemo } from 'react';

const UserContext = createContext({
    user: null,
    setUser: () => {},
    isLessor: false,
    setIsLessor: () => {},
    orderBy: { by: "createdAt", order: "desc" },
    setOrderBy: () => {},
    filter: {
        type: null,
        bedrooms: null,
        bathrooms: null,
        parkingLots: null,
        oldness: null,
    },
    setFilter: () => {},
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLessor, setIsLessor] = useState(false);
    const [orderBy, setOrderBy] = useState({ by:"createdAt", order: "desc" });
    const [filter, setFilter] = useState({
        type: null,
        bedrooms: null,
        bathrooms: null,
        parkingLots: null,
        oldness: null,
    });

    const contextValue = useMemo(() => ({
        user,
        setUser,
        isLessor,
        setIsLessor,
        orderBy,
        setOrderBy,
        filter,
        setFilter,
    }), [user, isLessor, orderBy, filter]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;