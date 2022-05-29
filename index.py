import pandas as pd 
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import sigmoid_kernel

#reading the dataset
movies_df = pd.read_csv("datasets/movies.csv")
credits = pd.read_csv("datasets/tmdb_5000_credits.csv")

#getting features to be used
selected_features = ['genres','keywords','tagline','cast','director','original_title']

#dropping the data in columns having null value
for feature in selected_features:
  movies_df[feature] = movies_df[feature].fillna('')

movies_df['production_companies'] = movies_df['production_companies'].fillna('')

column = movies_df['production_companies']
i=0

#getting the 'production_companies' column value
for col in movies_df['production_companies']:
    res = json.loads(col)
    new_value =""
    for obj in res:
        new_value = new_value +' '+obj['name'].replace(" ", "")
   
    movies_df['production_companies'][i]=new_value
    i=i+1


#merging the 'credits' and 'movies_df' on the basis the id
credits_column_renamed = credits.rename(index=str, columns={"movie_id": "id"})
movies_df_merge = movies_df.merge(credits_column_renamed, on='id')


#getting combined_features to be used
combined_features = movies_df['genres']+' '+movies_df['keywords']+' '+movies_df['tagline']+' '+movies_df['cast']+' '+movies_df['director']+movies_df['production_companies'] +movies_df['original_title']

#dropping the data in columns having null value
movies_cleaned_df = movies_df_merge.drop(columns=['homepage', 'title_x', 'title_y', 'status','production_countries'])

#getting the vector
tfv = TfidfVectorizer(min_df=3,  max_features=None, 
            strip_accents='unicode', analyzer='word',token_pattern=r'\w{1,}',
            ngram_range=(1, 3),
            stop_words = 'english')

#dropping the data in columns having null value
movies_cleaned_df['overview'] = movies_cleaned_df['overview'].fillna('')

#getting combined_features to be used
movies_cleaned_df['combined_features']=combined_features + movies_cleaned_df['overview']

#fit the matrix by relation
tfv_matrix = tfv.fit_transform(movies_cleaned_df['combined_features'])

sig = sigmoid_kernel(tfv_matrix, tfv_matrix)

#get the index and data series
indices = pd.Series(movies_cleaned_df.index, index=movies_cleaned_df['original_title']).drop_duplicates()

def give_rec(title, sig=sig):
    # Get the index corresponding to original_title
    idx = indices[title]

    # Get the pairwsie similarity scores 
    sig_scores = list(enumerate(sig[idx]))

    # Sort the movies 
    sig_scores = sorted(sig_scores, key=lambda x: x[1], reverse=True)

    # Scores of the 10 most similar movies
    sig_scores = sig_scores[1:6]

    # Movie indices
    movie_indices = [i[0] for i in sig_scores]

    # Top 10 most similar movies
    return movies_cleaned_df['original_title'].iloc[movie_indices]

#open the "movies_seen.json" to get the movies and get the recommeded movies by model
with open("movies_seen.json") as f:
    data = json.load(f)
    likedMoviesList = data[0]["likedMovies"]

    recommendedMovies = []
 
    for movies in likedMoviesList:
        if movies!='':
            print(movies)
            result = give_rec(movies).tolist()

            recommendedMovies=recommendedMovies+result

    recommended_movies_dict ={
        "recommend":recommendedMovies
    }
    recommended_movies_json = json.dumps(recommended_movies_dict)

    # Writing to static/recommended_movies.json
    with open("static/recommended_movies.json", "w") as outfile:
        outfile.write(recommended_movies_json)

    print("it is working")
    outfile.close()

f.close()


