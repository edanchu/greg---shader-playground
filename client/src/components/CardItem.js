import React from 'react';
import { Link } from 'react-router-dom';
import GraphicsComponent from './graphics_component';

function CardItem(props) {
  return (
    <>
      <li className='cards__item'>
        <Link className='cards__item__link' to={props.path}>
          <figure className='cards__item__pic-wrap' data-category={props.label}>
            <GraphicsComponent
              className='cards__item__img'
              pause={props.pause}
              playOnMouseOver={props.playOnMouseOver}
              showButtons={props.showButtons}
              commonFragShaderCustomCode={props.commonFragShaderCustomCode}
              finalFragShaderCustomCode={props.finalFragShaderCustomCode}
              buffer1FragShaderCustomCode={props.buffer1FragShaderCustomCode}
              buffer2FragShaderCustomCode={props.buffer2FragShaderCustomCode}
              buffer3FragShaderCustomCode={props.buffer3FragShaderCustomCode}
              buffer4FragShaderCustomCode={props.buffer4FragShaderCustomCode}
              channels={props.channels}
            />
          </figure>
          <div className='cards__item__info'>
            <h5 className='cards__item__text'>{props.text}</h5>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CardItem;
