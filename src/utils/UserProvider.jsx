import React, { createContext, useState } from 'react';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLessor, setIsLessor] = useState(false);
    const [orderBy, setOrderBy] = useState({ by:"createdAt", order: "desc"});
    const [filter, setFilter] = useState({
        type: null,
        bedrooms: null,
        bathrooms: null,
        parkingLots: null,
        oldness: null,
    });

    return (
        <UserContext.Provider value={{user, setUser, isLessor,setIsLessor, filter, setFilter,orderBy,setOrderBy}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;