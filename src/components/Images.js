import React, { Component } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchInput from "./SearchInput";
import Image from "./Image";
import RandomImgBtn from "./RandomImgBtn";

export class Images extends Component {
  // This is alternative class component syntax - class field declarations, allows you to initialize local state without using the constructor and declare class methods by using arrow functions without the extra need to bind them. See https://github.com/the-road-to-learn-react/react-alternative-class-component-syntax and https://www.robinwieruch.de/react-state-without-constructor
  state = {
    images: [],
    count: 9,
    page: 1,
    term: "",
    search: false,
    blankSearch: false,
    inputValue: "",
    totalPages: null,
    totalResults: null,
    randomImage: null,
  };

  componentDidMount() {
    console.log("componentDidMount is called");
    const { page, count } = this.state;
    axios.get(`/api/photos?page=${page}&count=${count}`).then((res) => {
      this.setState({
        images: res.data.response.results,
      });
      console.log(this.state.images);
    });
    // To prevent same images being fetched upon scrolling (in the first call to fetchImages)
    this.setState({ page: page + 1 });
  }

  fetchImages = () => {
    console.log("fetching images");
    const { page, count, term, images, search } = this.state;

    this.setState({
      inputValue: "",
      randomImage: null,
    });

    if (!search) {
      console.log(`page: ${page} count: ${count}`);
      axios.get(`/api/photos?page=${page}&per_page=${count}`).then((res) => {
        this.setState({
          images: images.concat(res.data.response.results),
        });
        console.log(this.images);
      });
    } else {
      axios
        .get(`/api/photos/search?term=${term}&page=${page}&count=${count}`)
        .then((res) =>
          this.setState({
            totalPages: res.data.total_pages,
            totalResults: res.data.total,
            images: images.concat(res.data.response.results),
          })
        );
    }

    this.setState({
      page: page + 1,
    });
  };

  getRandomImage = () => {
    axios.get(`/api/photos/random`).then((res) => {
      console.log(res);
      this.setState({
        randomImage: res.data.response,
        images: [],
        totalPages: null,
        totalResults: null,
        search: false,
      });
    });
  };

  // Necessary to place fetchImages in a setState callback to ensure other state is set first
  handleSubmit = () => {
    if (!this.state.inputValue) {
      this.setState(
        {
          images: [],
          blankSearch: true,
          search: false,
          page: 1,
        },
        this.fetchImages
      );
    } else {
      this.setState(
        {
          term: this.state.inputValue,
          images: [],
          page: 1,
          search: true,
        },
        this.fetchImages
      );
    }
  };

  handleInputChange = (e) => {
    this.setState({
      inputValue: e,
    });
  };

  render() {
    // Eliminates vertical scrollbar when a single image is displayed
    let html = document.querySelector("html");
    this.state.randomImage
      ? (html.style.overflowY = "hidden")
      : (html.style.overflowY = "auto");

    return (
      <>
        <div className="top-content">
          <SearchInput
            onSearch={this.handleInputChange}
            inputValue={this.state.inputValue}
            onFormSubmit={this.handleSubmit}
          />
          <RandomImgBtn getRandomImage={this.getRandomImage} />
        </div>

        <div>
          <InfiniteScroll
            dataLength={this.state.images.length}
            next={this.fetchImages}
            hasMore={
              this.state.randomImage
                ? false
                : this.state.search &&
                  this.state.totalResults &&
                  this.state.page < this.state.totalPages
                ? true
                : !this.state.search
                ? true
                : false
            }
            loader={
              <div className="loader-dots">
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
              </div>
            }
          >
            {this.state.search && this.state.totalResults === 0 ? (
              "No results found"
            ) : this.state.randomImage ? (
              <Image
                key={this.state.randomImage.id}
                image={this.state.randomImage}
                photographer={this.state.randomImage.user.name}
              />
            ) : (
              this.state.images.map((image) => (
                <Image
                  key={image.id + Math.random()}
                  image={image}
                  photographer={image.user.name}
                />
              ))
            )}
          </InfiniteScroll>
        </div>
      </>
    );
  }
}

export default Images;
