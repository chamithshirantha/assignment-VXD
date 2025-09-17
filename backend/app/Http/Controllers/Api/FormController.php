<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use Illuminate\Http\Request;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Form::with('fields.options')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['title'=>'required|string','fields'=>'array']);
        $form = Form::create(['title'=>$request->title]);
        $this->saveFields($form, $request->fields ?? []);
        return response()->json($form->load('fields.options'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Form::with('fields.options')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate(['title'=>'required|string','fields'=>'array']);
        $form = Form::findOrFail($id);
        $form->update(['title'=>$request->title]);
        $form->fields()->delete();
        $this->saveFields($form, $request->fields ?? []);
        return response()->json($form->load('fields.options'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $form = Form::findOrFail($id);
        $form->delete();
        return response()->json(null, 204);
    }

    protected function saveFields(Form $form, array $fields){
        foreach ($fields as $idx => $f){
            $field = $form->fields()->create([
                'type' => $f['type'],
                'label' => $f['label'] ?? '',
                'required' => !empty($f['required']),
                'order' => $f['order'] ?? $idx
            ]);
            if (in_array($f['type'], ['checkbox','radio']) && !empty($f['options'])){
                foreach ($f['options'] as $opIdx => $op){
                    $field->options()->create([
                        'label' => $op['label'] ?? ($op['value'] ?? 'Option'),
                        'value' => $op['value'] ?? null,
                        'order' => $opIdx
                    ]);
                }
            }
        }
    }
}
