export const formatDate = (dateString: string | number | Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTitle = (title: string): string => {
    return title.charAt(0).toUpperCase() + title.slice(1);
};

export const formatAuthor = (author: string): string => {
    return author.split(' ').map((name: string) => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
};
