import React, { ReactNode } from "react"

interface SectionLoaderProps {
    loading: boolean
    children: ReactNode
    skeleton: ReactNode
}

export const SectionLoader: React.FC<SectionLoaderProps> = ({ loading, children, skeleton }) => {
    if (loading) return skeleton
    return children
}
