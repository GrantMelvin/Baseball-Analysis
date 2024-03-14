# List of queries to use on MongoDB

## Check for balls that were called inside of the zone:

    {
        "$and": [
            {
            "description": { "$regex": "ball", "$options": "i" }
            },
            {
            "zone": { "$in": ["1", "2", "3", "4", "5", "6", "7", "8", "9"] }
            }
        ]
    }

## Check for strikes that were called outside of the zone:

    {
        "$and": [
            {
            "description": { "$regex": "strike", "$options": "i" }
            },
            {
            "zone": { "$in": ["11", "12", "13", "14"] }
            }
        ]
    }
