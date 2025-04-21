export const SectionLoader = ({ loading, children, skeleton }) => {
    if (loading) return skeleton
    return children
}
