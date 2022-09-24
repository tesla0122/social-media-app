import { pinDetail } from "../types"

export const searchPinsQuery = (searchTerm: string) => (
    `*[_type == "pin" && title match "${searchTerm}*" || category match "${searchTerm}*" || about match "${searchTerm}*"] | order(createdAt desc) {
        _id,
        image {
            asset {
                _ref
            }
        },
        destination,
        postedBy -> {
            _id,
            username,
            image
        },
        _createdAt,
        title,
        save
    }` 
)

export const feedQuery = () => (
    `*[_type == "pin"] | order(createdAt desc) {
        _id,
        image {
            asset {
                _ref
            }
        },
        destination,
        postedBy -> {
            _id,
            username,
            image
        },
        _createdAt,
        title,
        save
    }` 
)

export const pinDetailQuery = (pinId: string) => (
    `*[_type == "pin" && _id == "${pinId}"] {
        _id,
        image {
            asset {
                _ref
            }
        },
        destination,
        postedBy -> {
            _id,
            username,
            image
        },
        _createdAt,
        title,
        save,
        about,
        comments[] {
            _key,
            text,
            postedBy -> {
                _id,
                username,
                image
            }
        },
        category
    }` 
)

export const pinDetailMorePinQuery = (pin: pinDetail) => (
    `*[_type == "pin" && category == "${pin.category}" && _id != "${pin._id}"] {
        _id,
        image {
            asset {
                _ref
            }
        },
        destination,
        postedBy -> {
            _id,
            username,
            image
        },
        _createdAt,
        title,
        save
    }` 
)

export const commentPinQuery = (pinId: string) => (
    `*[_type == "pin" && _id == "${pinId}"] {
        comments[] {
            _key,
            text,
            postedBy -> {
                _id,
                username,
                image
            }
        }
    }` 
)

export const userCreatedPinsQuery = (userId: string) => (
    `*[_type == "pin" && postedBy._ref == "${userId}"] | order(_createdAt desc) {
        _id,
        image {
            asset -> {
                url
            }
        },
        destination,
        postedBy -> {
            _id,
            username,
            image
        },
        _createdAt,
        title,
        save
    }` 
)

export const userSavedPinsQuery = (userId: string) => (
    `*[_type == "pin" && "${userId}" in save[]._ref ] | order(_createdAt desc) {
        _id,
        image {
            asset -> {
                url
            }
        },
        destination,
        postedBy -> {
            _id,
            username,
            image
        },
        _createdAt,
        title,
        save
    }` 
)

export const userQuery = (userId: string) => (
    `*[_type == "user" && _id == "${userId}"] {
        _id,
        username,
        image
    }` 
)

