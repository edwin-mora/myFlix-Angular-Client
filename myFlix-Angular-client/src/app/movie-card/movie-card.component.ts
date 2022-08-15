import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  user: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * Gets movies from api call and sets the movies state to return JSON file
   * @returns array holding movies objects
   * @function getAllMovies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Gets favorite movies from api call and sets the favorite movies variable to return JSON file
   * @returns array holding ids of user's favorite movies
   * @function getFavoriteMovies
   */
  getFavoriteMovies(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.favoriteMovies = resp.FavoriteMovies;
      console.log(this.favoriteMovies);
    });
  }

  /**
   * opens the user genre dialog from GenreComponent to displaying details
   * @param name
   * @param description
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
      // Assign dialog width
      width: '500px',
    });
  }

  /**
   * opens the user director dialog from DirectorComponent to displaying details
   * @param name
   * @param bio
   * @param birthday
   */
  openDirectorDialog(name: string, bio: string, birthday: Date): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birthday: birthday,
      },
      // Assign dialog width
      width: '500px',
    });
  }

  /**
   * opens the user synopsis dialog from SynopsisComponent to displaying details
   * @param title
   * @param description
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisComponent, {
      data: {
        Title: title,
        Description: description,
      },
      // Assign dialog width
      width: '500px',
    });
  }

  /**
   * adds a movie to the list of favorite movies via an API call
   * @param id
   * @function addFavoriteMovie
   */
  addFavoriteMovies(movieID: string, title: string): void {
    this.fetchApiData.addFavoriteMovies(movieID).subscribe(() => {
      this.snackBar.open(`${title} has been added to your favorites!`, 'OK', {
        duration: 4000,
      });
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

  /**
   * use API endpoint to remove user favorite
   * @function deleteFavoriteMovies
   * @param Id {string}
   * @returns favorite movies has been updated in json format
   */
  removeFavoriteMovies(movieID: string, title: string): void {
    this.fetchApiData.deleteFavoriteMovies(movieID).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(
        `${title} has been removed from your favorites!`,
        'OK',
        {
          duration: 4000,
        }
      );
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

  /**
   * is movie already in favoritelist of user
   * @param id {string}
   * @returns true or false
   */
  isFavorite(movieID: string): boolean {
    return this.favoriteMovies.some((movie) => movie._id === movieID);
  }

  /**
   * add or remove favorite movie
   * if the movie is not on the favorite list, call
   * @function addFavoriteMovies
   * if the movie is already on the user favorite list, call
   * @function removeFavoriteMovies
   * @param movie {any}
   */
  toggleFavorite(movie: any): void {
    this.isFavorite(movie._id)
      ? this.removeFavoriteMovies(movie._id, movie.Title)
      : this.addFavoriteMovies(movie._id, movie.Title);
  }
}
