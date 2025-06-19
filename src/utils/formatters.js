export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTitle = (title) => {
    return title.charAt(0).toUpperCase() + title.slice(1);
};

export const formatAuthor = (author) => {
    return author.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
};