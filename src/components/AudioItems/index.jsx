import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'
AudioItems.propTypes = {
    data: PropTypes.array,
    handleSaveIndex: PropTypes.func,
    active: PropTypes.number,
};
AudioItems.default = {
    data: [],
    handleSaveIndex: null,
    active: 0
}

function AudioItems(props) {
    const { data, handleSaveIndex, active } = props;
    const handleIndex = (id) => {
        if (handleSaveIndex) {
            handleSaveIndex(id);
        }
    }
    return (
        <ul className="song-list">
            {data.map((song, index) => {
                return <li key={song.id} className={`song ${index === active ? 'active' : ''}`} onClick={() => handleIndex(song.id)}>
                    <img className="song-img" src={song.image} alt={song.name} />
                    <div>
                        <span className="song-name-artist">{`${song.name} - ${song.artist}`}</span>
                    </div>
                </li>;
            })}
        </ul>
    );
}

export default AudioItems;