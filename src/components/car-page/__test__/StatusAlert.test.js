import React from "react";

import renderer from 'react-test-renderer';
import {StatusAlert} from "../StatusAlert";

it('status alert should match with snapshot', () => {
    const component = renderer.create(
        <StatusAlert status={null} onClose={() => {}} open={false}/>
    )

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})
