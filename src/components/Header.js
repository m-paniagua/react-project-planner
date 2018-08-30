import React, { Component } from 'react'

class Header extends Component {
    render() {
        // var to hold options to select dropdown
        const projectOptions = this.props.projects.map(project =>
            <option key={project.id} value={project.id}>
                {project.name}
            </option>
        )

        // when selected call onCurrentProjectChange()
        return (
            <div className="project-item">
                Project:&nbsp;
                <select
                    onChange={this.props.onCurrentProjectChange}
                    className="project-menu"
                // defaultValue={-1}
                >
                    {/* <option value="-1" disabled>Select a project</option> */}
                    {projectOptions}
                </select>
            </div>
        )
    }
}

export default Header