/**
 * app
 */
import React from "react";

export default React.createClass({
  displayName: "app",

  propTypes: {
    data: React.PropTypes.object
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  render() {
    console.log(this.props, this.state);
    return (
      <div> </div>
    );
  }
});
