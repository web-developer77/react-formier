# Change Log
All notable changes to this project will be documented in this file

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 1.7.2
### Changed
 - Decreaesed the timeout of the debounce.

## 1.7.1
### Added
 - Interpolate option for htmlelement and content components.
 
## 1.7.0
### Fixed
 - Better React 16 support.

## 1.6.1
## Fixed
 - Select component was using old props when refreshing items. (From 1.5.26)

## 1.6.0
### Changed
 - Add create-react-class for React 16 support.

## 1.5.25
### Added
 - AllowCalculateOverride support.

### Fixed
 - has-error classes removed from top level day and editgrid components.

## 1.5.24
### Added
 - Component json added to custom default value and calculated value context.

## 1.5.23
### Fixed
 - Signature sometimes resetting when form redraws.

## 1.5.22
### Fixed
 - Number validations triggering on null.

## 1.5.21
### Changed
 - Signature minimum changed from kb to percentage increase.

## 1.5.20
### Fixed
 - Validations set to 0 not validating.

## 1.5.19
### Added
 - Make signature size error overridable.

## 1.5.18
### Fixed
 - Crashing error when resetting signature if validation enabled.

## 1.5.17
### Reverted
 - Changes from 1.5.15

## 1.5.16
### Added
 - Signature minimum size validation.

## 1.5.15
### Fixed
 - If a component has a default value, set it on the submission even if skipInit is set.

## 1.5.14
### Fixed
 - Number components counted a - as a valid value.

## 1.5.13
### Changed
 - Update version of text-mask-addon to fix android cursor positioning.

## 1.5.12
### Added
 - Moment.js to eval default values.

## 1.5.11
### Reverted
 - Change from 1.5.4 that made editgrid remove buttons act as close.

## 1.5.10
### Fixed
 - Day component validation not properly validating required.

## 1.5.9
### Reverted
 - 1.4.21 - Override skip init for conditionally visible.

## 1.5.8
### Fixed
 - Day components not defaulting to 00/00/0000 when initialized.

## 1.5.7
### Reverted
 - Removed automatic thousands separator from numbers and currency

### Added
 - Ability to specify thousands separator with component.thousandsSeparator.

## 1.5.6
### Added
 - Support for hidden flag on component definitions.

## 1.5.5
### Fixed
 - Lodash imports for clone.

## 1.5.4
### Changed
 - Editgrid rows close now removes new rows but just close existing rows.
 - Changed events when editing and saving rows.

## 1.5.3
### Fixed
 - Datagrid not always refreshing when a component is hidden.

## 1.5.2
### Fixed
 - Stop signature clearing on resize.

## 1.5.1
### Fixed
 - Allow select component to set headers.

## 1.5.0
### Added
 - Number and currency components can be limited to a certain number of decimals.

## 1.4.26
### Fixed
 - Crash in signature component when in read only mode.

## 1.4.25
### Fixed
 - Nesting datagrids passing parameters wrong causing remove rows to call on wrong datagrid.

## 1.4.24
### Fixed
 - Pass input variable to select custom values so that manual filtering can be done.

## 1.4.23
### Fixed
 - Add typecheck to date parsing.

## 1.4.22
### Fixed
 - Date picker on android only returns the date portion which makes the rendered date appear on the day before.

## 1.4.21
### Changed
 - Upgrade formiojs to 2.25.4

### Fixed
 - Fix skipInit preventing default values being set on conditionally visible fields.

## 1.4.20
### Fixed
 - Fix crash of editgrid when using the default template that contains a util function.
 - Fix crash of editgrid when not using skipInit that would attempt to change the array to an object.

## 1.4.19
### Fixed
 - Day component didn't properly implement custom validations.

## 1.4.18
### Fixed
 - Hiding items in editgrids didn't remove their values.

## 1.4.17
### Changed
 - Upgrade react-widgets version to 4.x.

## 1.4.16
### Changed
 - Decrease animations to 10ms

## 1.4.15
### Fixed
 - Crash in select resources if not json due to change in 1.4.14

## 1.4.14
### Fixed
 - Fix performance of rendering select json components with lots of items in the json array.

## 1.4.13
### Fixed
 - Select components with lots of json were slow to filter. Pre-rendering the data on load speeds it up.

## 1.4.12
### Fixed
 - Datagrids and containers embedded within other datagrids and containers not setting values properly.

## 1.4.11
### Added
 - Support for column definitions.

## 1.4.10
### Fixed
 - Crash when empty rows are deleted from datagrids.

## 1.4.9
### Fixed
 - Input masks not initializing validity properly.

## 1.4.8
### Fixed
 - Select JSON with a value property not finding item when loading in a submission.

## 1.4.7
### Fixed
 - Disable editgrid controls when form is read-only.
 - Edit grid was not fully calculating validity on form load.

## 1.4.6
### Fixed
 - Input mask not required for required fields.

## 1.4.5
### Fixed
 - Edit grid editing was showing all fields as invalid.

## 1.4.4
### Fixed
 - Fix issue where Select JSON fields couldn't set the value field.

## 1.4.3
### Fixed
 - Fix issue where components in a container that hide at the same time can't fail to clear data.

## 1.4.2
### Changed
 - Fire edit grid open event on componentDidMount instead of componentWillMount.

## 1.4.1
### Fixed
 - HTML output of editgrid header

### Added
 - Footer for editgrid

## 1.4.0
### Added
 - Time component
 - EditGrid component

## 1.3.14
 - Fix default formatting of empty custom error validation.

## 1.3.13
### Fixed
 - Disable datagrid buttons when form is read only.
 - Don't fire change events for readOnly forms.

## 1.3.12
### Added
 - Events that fire when select lists open or close.
 - Event that fires on add/remove from datagrid.
 - Event that fires on loadMore for selects.

## 1.3.11
### Reverted
 - Reverted revert of change to datagrids delete value.

### Fixed
 - Calculated Select values could return something other than an array which caused an error.

## 1.3.10
### Reverted
 - Reverted change to setting values that attempted to fix deleting rows in datagrids issue that had a lot of side effects.

### 1.3.9
### Fixed
 - Fix MinLength calculation for datagrids.
 - Fixed error about setState in select component.
 - Scenario where updating a form doesn't always set the values.

### Changed
 - Replace full lodash with individual functions.

## 1.3.8
### Fixed
 - Datagrids with select components dependent on external data weren't updating when the data updated.

## 1.3.7
### Changed
 - Datagrid headers won't render if there are no labels.

## 1.3.6
### Fixed
 - Deleting rows in datagrids didn't clear components properly.

## 1.3.5
### Fixed
 - Fix performance of datagrids with large data.

## 1.3.4
### Added
 - Onchange event will fire for input fields after 500ms of no typing instead of only on blur.

## 1.3.3
### Added
 - Expose mixins as exports to ease creation of custom components.

## 1.3.2
Changed
 - Text inputs will fire change events on blur now instead of on change. Change events were too slow in redux.

## 1.3.1
### Fixed
 - Fixed tests dealing with input mask change and missing onChange events.

### Removed
 - Removing tests that don't work with current libraries.

## 1.3.0
### Changed
 - Swapped react-input-mask for react-text-mask for input masks.
 - Improved performance of input masks.
