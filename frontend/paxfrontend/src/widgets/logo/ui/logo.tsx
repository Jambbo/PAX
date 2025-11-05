import React from 'react'
import {Link} from "react-router-dom";

export const Logo = () => {
    return (
        <Link
            to="/"
            className="text-4xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
        >
            PAX
        </Link>
    )
}