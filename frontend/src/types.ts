
type postedBy = {
    _id: string
    username: string
    image: string
}

type imagePin = {
    asset: {
        _ref: string
    }
}

type save = {
    _key: string
    _ref: string
}

export type user = postedBy

export type pin = {
    _id: string
    image: imagePin
    postedBy: postedBy

    _createdAt: string

    destination: string

    title: string

    save: save[]
}

export type pinDetail = {
    _id: string
    image: imagePin
    postedBy: postedBy

    _createdAt: string

    destination: string

    title: string

    about: string

    category: string

    save: save[]

    comments: {
        _key: string
        text: string
        postedBy: postedBy
    }[]
}