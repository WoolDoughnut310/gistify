const BASE_URL = "https://api.github.com/gists";

// Creates a gist from filename and content
export const createGist = async (authToken, filename, content) => {
    const response = await fetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify({
            public: true,
            files: {
                [filename]: {
                    content,
                },
            },
        }),
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${authToken}`,
        },
    });
    const data = await response.json();
    return data.html_url;
};
