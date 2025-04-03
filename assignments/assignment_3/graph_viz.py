import kuzu

def process_graph_data(result):
    """
    TODO: implement the processing function that transforms query result into a format suitable for frontend visualization
    """
    
    # Sample movie graph data with target output structure
    sample_data = {
        "nodes": [
            {
                "id": "Movie_1",
                "labels": ["Movie"],
                "properties": {"title": "The Matrix", "year": 1999}
            },
            {
                "id": "Person_1",
                "labels": ["Person"],
                "properties": {"name": "Keanu Reeves"}
            },
            {
                "id": "Person_2",
                "labels": ["Person"],
                "properties": {"name": "Laurence Fishburne"}
            },
            {
                "id": "Person_3",
                "labels": ["Person"],
                "properties": {"name": "Carrie-Anne Moss"}
            },
            {
                "id": "Person_4",
                "labels": ["Person"],
                "properties": {"name": "Lana Wachowski", "role": "Director"}
            },
            {
                "id": "Genre_1",
                "labels": ["Genre"],
                "properties": {"name": "Sci-Fi"}
            }
        ],
        "links": [
            {
                "source": "Person_1",
                "target": "Movie_1",
                "type": "ACTED_IN"
            },
            {
                "source": "Person_2",
                "target": "Movie_1",
                "type": "ACTED_IN"
            },
            {
                "source": "Person_3",
                "target": "Movie_1",
                "type": "ACTED_IN"
            },
            {
                "source": "Person_4",
                "target": "Movie_1",
                "type": "DIRECTED"
            },
            {
                "source": "Movie_1",
                "target": "Genre_1",
                "type": "IN_GENRE"
            }
        ]
    }
    
    return sample_data

def construct_query(year=None, operator='>', limit=100):
    """
    TODO: Copy the parameterized query function from the previous part and make it work here
    """
    return "MATCH (m) RETURN m LIMIT 25"