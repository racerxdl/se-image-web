import React, {SyntheticEvent, useCallback, useEffect, useRef, useState} from 'react';
import {useDropzone} from "react-dropzone";
import {
    Lcd,
    ProviderByName,
    StandardSize,
    TextSurface,
    TextSurfaceProvider,
    TextSurfaceProviders
} from "./spaceengineers/surface";
import {NewVector2, Vector2, Vector2Mul} from "./image/vector";
import {buildImageString, FilterCanvas} from "./spaceengineers/process";
import {FilterByName} from "./image/dither";
import {PIXELS_TO_CHARACTERS} from "./spaceengineers/constants";
import {makeStyles} from '@material-ui/styles';
import {
    Alert,
    AlertColor,
    Card,
    CardContent, Checkbox, Container, FormControl, FormControlLabel, FormGroup,
    Grid, InputLabel, MenuItem, Select, SelectChangeEvent,
    Snackbar,
    SnackbarCloseReason, TextField,
    Typography
} from "@mui/material";
import {HexColorPicker} from "react-colorful";

const useStyles = makeStyles({
    app: {
        background: '#555555',
    },
    boxCenter: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    imageBox: {
        // maxWidth: 320,
        margin: '5px',
        padding: '10px'
    },
    configBox: {
        // maxWidth: 380,
        margin: '5px',
        padding: '10px'
    },
    colorPicker: {
        width: '100px !important',
        height: '100px !important',
    },
    selectBox: {
        minWidth: 256,
        minHeight: 256,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    resultBox: {
        margin: '5px',
        padding: '10px'
    },
    resultString: {
        maxWidth: 256,
        maxHeight: 200,
        overflow: 'hidden'
    }
})

function App() {
    const classes = useStyles();
    const canvasPreviewRef = useRef<HTMLCanvasElement>(null)

    // Notification
    const [notifOpen, setNotifOpen] = React.useState<boolean>(false);
    const [notifMsg, setNotifMsg] = React.useState<string>("")
    const [notifSeverity, setNotifySeverity] = React.useState<AlertColor>("success")

    // Dither Settings
    const [filterName, setFilterName] = useState<string>('FloydSteinberg')

    // Space Engineers
    const [block, setBlock] = useState<TextSurfaceProvider>(Lcd); // Current Block Type
    const [surface, setSurface] = useState<TextSurface>(block.TextSurfaces[0]!) // Current Block Surface
    const [stringImage, setStringImage] = useState<string>("")
    const [streched, setStreched] = useState<boolean>(false) // Framed image
    const [xy, setXY] = useState<Vector2>(NewVector2(0, 0))
    const [wh, setWH] = useState<Vector2>(NewVector2(0, 0))
    const [size, setSize] = useState<Vector2>(NewVector2(0, 0)) // Output size
    const [bgcolor, setBgcolor] = useState<string>('#000000') // Background Color

    // Loaded Image
    const [imageData, setImageData] = useState<HTMLImageElement | null>(null); // Current image data
    const [imageSrc, setImageSrc] = useState<string>("");

    // Clipboard
    const [canClipboard, setCanClipboard] = useState<boolean>(false);

    // When update surface, update base size
    useEffect(() => {
        const scale = StandardSize.X / Math.min(surface.TextureSize.X, surface.TextureSize.Y)
        const s = Vector2Mul(surface.SurfaceSize, PIXELS_TO_CHARACTERS * scale);
        s.X = Math.round(s.X)
        s.Y = Math.round(s.Y)
        setSize(s)
        if (wh.X === 0 || wh.Y === 0) {
            setXY(NewVector2(0, 0))
            setWH(s)
        }
        console.log(`Updated size to ${s.X} : ${s.Y}`)
    }, [wh, surface])

    // Get clipboard permissions if possible
    useEffect(() => {
        // @ts-ignore
        navigator.permissions.query({name: "clipboard-write"}).then(result => {
            setCanClipboard(result.state === "granted" || result.state === "prompt")
            console.log(`Clipboard grant: ${result.state === "granted" || result.state === "prompt"}`)
        });
    })

    // Select all pre content and put in clipboard
    const selectAll = (e: any) => {
        const selection = window.getSelection()!;
        const range = document.createRange();
        range.selectNodeContents(e.target);
        selection.removeAllRanges();
        selection.addRange(range);
        if (canClipboard) {
            navigator.clipboard.writeText(stringImage).then(() => {
            })
        } else {
            document.execCommand('copy');
        }
        setNotifMsg('copied to clipboard')
        setNotifOpen(true)
    }

    // Update Canvas
    useEffect(() => {
        if (!canvasPreviewRef.current) {
            return
        }
        const canvas = canvasPreviewRef.current
        const ctx = canvas.getContext('2d')!
        const filter = FilterByName[filterName];
        const {width, height} = canvas;

        if (imageData) {
            //Our first draw
            ctx.fillStyle = bgcolor
            ctx.fillRect(0, 0, width, height)
            let {X, Y} = xy;
            let {X: W, Y: H} = wh;

            if (streched) {
                X = 0
                Y = 0
                W = width
                H = height
            }
            // ctx.translate(W, 0);
            ctx.scale(-1, 1);
            ctx.rotate(3.14/2);
            ctx.drawImage(imageData, X, Y, W, H);
            FilterCanvas(canvas, filter)
            setStringImage(buildImageString(canvas, `Size: ${width}x${height} - from Teske's Lab & Whiplash141`))
        } else {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, width, height)
            ctx.fillStyle = '#333333'
            ctx.font = "15px Arial";
            const m = ctx.measureText('Load an image')
            ctx.fillText("Load an image", (width - m.width) / 2, (height - 15) / 2);
        }
    }, [filterName, bgcolor, streched, xy, wh, imageData, size])

    // Image Drop
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length === 1) {
            console.log(`Loading image ${acceptedFiles[0]}`)
            const fr = new FileReader();
            fr.onload = function () {
                const img = new Image();
                img.src = fr.result as string;
                setImageSrc(fr.result as string)
                img.onload = () => setImageData(img)
                setNotifySeverity("success")
                setNotifMsg("Loaded image")
                setNotifOpen(true)
            }
            fr.readAsDataURL(acceptedFiles[0]);
        } else {
            setNotifMsg("Please select a single image")
            setNotifySeverity("error")
            setNotifOpen(true)
        }
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const handleClose = (event: SyntheticEvent, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotifOpen(false);
    };

    const changeProvider = (event: SelectChangeEvent) => {
        console.log(`Changing block to ${event.target.value}`)
        const provider = ProviderByName[event.target.value]
        if (provider) {
            setBlock(provider)
            setSurface(provider.TextSurfaces[0]!)
        }
    }

    const changeSurface = (event: SelectChangeEvent) => {
        block.TextSurfaces.forEach((surface) => {
            if (surface?.SufaceName === event.target.value) {
                setSurface(surface)
            }
        })
    }

    const changeFilter = (event: SelectChangeEvent) => {
        setFilterName(event.target.value.toString())
    }

    const stretchedChange = (e: React.SyntheticEvent, checked: boolean) => {
        setStreched(checked)
    }

    const changePlacement = (axis: string, value: number) => {
        if (isNaN(value)) {
            return
        }
        switch (axis) {
            case 'x':
                setXY(NewVector2(value, xy.Y))
                break
            case 'y':
                setXY(NewVector2(xy.X, value))
                break
            case 'w':
                setWH(NewVector2(value, wh.Y))
                break
            case 'h':
                setWH(NewVector2(wh.Y, value))
                break
        }
    }

    return (
        <div className={classes.app}>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                open={notifOpen}
                autoHideDuration={2000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={notifSeverity} sx={{width: '100%'}}>
                    {notifMsg}
                </Alert>
            </Snackbar>
            <Container>
                <Grid container>
                    <Grid item md={2}/>
                    <Grid item xs={12} md={4}>
                        <Card className={classes.imageBox}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">Original Image</Typography>
                            </CardContent>
                            <div {...getRootProps()} className={classes.selectBox}
                                 style={{border: isDragActive ? '2px dashed green' : '2px dashed grey'}}>
                                {imageSrc !== "" ?
                                    <div><input {...getInputProps()} /><img alt="original" src={imageSrc} style={{maxHeight: 160, maxWidth: 160}}/></div> :
                                    <div><input {...getInputProps()} /><p>Drop the image here or click to load</p></div>
                                }
                            </div>
                        </Card>
                        <Card className={classes.imageBox}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">Preview</Typography>
                            </CardContent>
                            <div className={classes.selectBox}>
                                <canvas ref={canvasPreviewRef} width={size.X} height={size.Y}/>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card className={classes.configBox}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">Configuration</Typography>
                            </CardContent>
                            <Grid container>
                                <Grid item xs={12} lg={6}>
                                    <div className={classes.selectBox}>
                                        <FormControl sx={{m: 1, minWidth: 200}}>
                                            <InputLabel id="block-label">Block</InputLabel>
                                            <Select
                                                labelId="block-label"
                                                id="block-selector"
                                                value={block.BlockName}
                                                label="Block Type"
                                                onChange={changeProvider}
                                            >
                                                {
                                                    TextSurfaceProviders.map(provider => <MenuItem
                                                        value={provider.BlockName}>{provider.BlockName}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                        <FormControl sx={{m: 1, minWidth: 200}}>
                                            <InputLabel id="surface-label">Surface</InputLabel>
                                            <Select
                                                labelId="surface-label"
                                                id="surface-selector"
                                                value={surface.SufaceName}
                                                label="Surface"
                                                onChange={changeSurface}
                                            >
                                                {
                                                    block.TextSurfaces.map((surface) => <MenuItem
                                                        value={surface!.SufaceName}>{surface!.SufaceName}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                        <FormControl sx={{m: 1, minWidth: 200}}>
                                            <InputLabel id="filter-label">Dither Filter</InputLabel>
                                            <Select
                                                labelId="filter-label"
                                                id="filter-selector"
                                                value={filterName}
                                                label="Dither Filter"
                                                onChange={changeFilter}
                                            >
                                                {
                                                    Object.keys(FilterByName).map((name) => <MenuItem
                                                        value={name}>{name}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <FormControl sx={{m: 1, minWidth: 200}}>
                                        <FormControlLabel control={<Checkbox/>} onChange={stretchedChange}
                                                          label="Stretch"/>
                                    </FormControl>
                                    <FormGroup>
                                        <Grid container>
                                            <Grid item xs={3}><TextField
                                                onChange={(e) => changePlacement('x', parseInt(e.target.value))}
                                                value={xy.X} disabled={streched} label="X" variant="outlined"/></Grid>
                                            <Grid item xs={3}><TextField
                                                onChange={(e) => changePlacement('y', parseInt(e.target.value))}
                                                value={xy.Y} disabled={streched} label="Y" variant="outlined"/></Grid>
                                            <Grid item xs={3}> <TextField
                                                onChange={(e) => changePlacement('w', parseInt(e.target.value))}
                                                value={wh.X} disabled={streched} label="W" variant="outlined"/></Grid>
                                            <Grid item xs={3}><TextField
                                                onChange={(e) => changePlacement('h', parseInt(e.target.value))}
                                                value={wh.Y} disabled={streched} label="H" variant="outlined"/></Grid>
                                        </Grid>
                                    </FormGroup>
                                    {!streched ?
                                        <div className={classes.boxCenter}>
                                            <Typography gutterBottom variant="h5" component="div">Background
                                                Color</Typography>
                                            <HexColorPicker className={classes.colorPicker} color={bgcolor}
                                                            onChange={setBgcolor}/>
                                        </div> : <div/>
                                    }
                                </Grid>
                            </Grid>
                        </Card>
                        <Card className={classes.resultBox}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">Result Text</Typography>
                            </CardContent>
                            <div className={classes.selectBox}>
                                <Typography variant="body2" color="text.secondary">
                                    {stringImage !== "" ? 'Click below to copy' : 'Waiting for image'}
                                </Typography>
                                <div className={classes.resultString}>
                                    <pre onClick={selectAll}>
                                        {stringImage}
                                    </pre>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default App;
