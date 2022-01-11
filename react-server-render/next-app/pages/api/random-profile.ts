import {NextApiRequest, NextApiResponse} from "next";

export interface Profile {
    "results": {
        "gender": string,
        "name": {
            "title": string,
            "first": string,
            "last": string
        },
        "location": {
            "street": string | {
                number: number;
                name: string;
            },
            "city": string,
            "state": string,
            "postcode": string,
            "coordinates": {
                "latitude": string,
                "longitude": string
            },
            "timezone": {
                "offset": string,
                "description": string
            }
        },
        "email": string,
        "login": {
            "uuid": string,
            "username": string,
            "password": string,
            "salt": string,
            "md5": string,
            "sha1": string,
            "sha256": string
        },
        "dob": {
            "date": string,
            "age": number
        },
        "registered": {
            "date": string,
            "age": number
        },
        "phone": string,
        "cell": string,
        "id": {
            "name": string,
            "value": string
        },
        "picture": {
            "large": string,
            "medium": string,
            "thumbnail": string
        },
        "nat": string
    }[],
    "info": {
        "seed": string,
        "results": number,
        "page": number,
        "version": string
    }
}

export default async function handler(req: NextApiRequest,
                                      res: NextApiResponse<Profile>
) {
    const response = await fetch('https://randomuser.me/api/', {
        method: 'get',
        headers: {contentType: 'application/json'}
    })
    const data = await response.json();
    res.status(200).json(data)
}