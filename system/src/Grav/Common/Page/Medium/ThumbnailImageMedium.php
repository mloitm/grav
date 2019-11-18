<?php

/**
 * @package    Grav\Common\Page
 *
 * @copyright  Copyright (C) 2015 - 2019 Trilby Media, LLC. All rights reserved.
 * @license    MIT License; see LICENSE file for details.
 */

namespace Grav\Common\Page\Medium;

class ThumbnailImageMedium extends ImageMedium
{
    /** @var Medium|null */
    public $parent;

    /** @var bool */
    public $linked = false;

    /**
     * Return srcset string for this Medium and its alternatives.
     *
     * @param bool $reset
     * @return string
     */
    public function srcset($reset = true)
    {
        return '';
    }

    /**
     * Get an element (is array) that can be rendered by the Parsedown engine
     *
     * @param string|null $title
     * @param string|null $alt
     * @param string|null $class
     * @param string|null $id
     * @param bool $reset
     * @return array
     */
    public function parsedownElement($title = null, $alt = null, $class = null, $id = null, $reset = true)
    {
        return $this->bubble('parsedownElement', [$title, $alt, $class, $id, $reset]);
    }

    /**
     * Return HTML markup from the medium.
     *
     * @param string|null $title
     * @param string|null $alt
     * @param string|null $class
     * @param string|null $id
     * @param bool $reset
     * @return string
     */
    public function html($title = null, $alt = null, $class = null, $id = null, $reset = true)
    {
        return $this->bubble('html', [$title, $alt, $class, $id, $reset]);
    }

    /**
     * Switch display mode.
     *
     * @param string $mode
     *
     * @return array|Link|Medium
     */
    public function display($mode = 'source')
    {
        return $this->bubble('display', [$mode], false);
    }

    /**
     * Switch thumbnail.
     *
     * @param string $type
     *
     * @return array|Link|Medium
     */
    public function thumbnail($type = 'auto')
    {
        $this->bubble('thumbnail', [$type], false);

        return $this->bubble('getThumbnail', [], false);
    }

    /**
     * Turn the current Medium into a Link
     *
     * @param  bool $reset
     * @param  array  $attributes
     * @return Link
     */
    public function link($reset = true, array $attributes = [])
    {
        return $this->bubble('link', [$reset, $attributes], false);
    }

    /**
     * Turn the current Medium into a Link with lightbox enabled
     *
     * @param  int  $width
     * @param  int  $height
     * @param  bool $reset
     * @return Link
     */
    public function lightbox($width = null, $height = null, $reset = true)
    {
        return $this->bubble('lightbox', [$width, $height, $reset], false);
    }

    /**
     * Bubble a function call up to either the superclass function or the parent Medium instance
     *
     * @param  string  $method
     * @param  array  $arguments
     * @param  bool $testLinked
     * @return array|Link|Medium
     */
    protected function bubble($method, array $arguments = [], $testLinked = true)
    {
        if (!$testLinked || $this->linked) {
            return $this->parent ? call_user_func_array(array($this->parent, $method), $arguments) : $this;
        }

        return call_user_func_array(array($this, 'parent::' . $method), $arguments);
    }
}
